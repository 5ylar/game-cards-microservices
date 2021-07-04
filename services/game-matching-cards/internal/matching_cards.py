import uuid, random
from datetime import datetime
from . import cache
from . import mq
from . import matching_cards_model as model


def create_match(user_id: str):

    c = cache.get_cache()

    match = model.Match(user_id)

    """ gen cards list """
    cards = []
    for i in range(12):
        card_number = (i % 6) + 1
        cards.append(model.MatchCard(card_number))

    """ shuffle cards """
    random.shuffle(cards)

    """ assign cards to each positions """
    for i in range(12):
        position = i + 1
        match.card_states[position] = cards[i]

    match_id = str(uuid.uuid4())

    """ remove previous match """
    try:
        previous_match_id = c.get("current_match__" + user_id)
        c.delete(previous_match_id)
    except:
        pass

    matchTTL = 60 * 60

    """ save match, expire in 60 minutes"""
    c.set(match_id, match.to_json(), matchTTL)

    """ save current match id, expire in 60 minutes """
    c.set("current_match__" + user_id, match_id, matchTTL)

    return match_id


def pick_card(match_id: int, position: int, user_id: str):

    c = cache.get_cache()
    
    # prevent race condition
    p = c.pipeline()
    p.watch(match_id)
    

    match = model.Match.from_json(p.get(match_id))

    if match is None:
        raise Exception("No match found")

    if match.user_id != user_id:
        raise Exception("Permission denied")

    if position < 1 or position > 12:
        raise Exception("Invalid position value, allow only 1 - 12")

    """ add click times """
    match.click_times += 1
    
    current_pickedup_card = match.card_states[str(position)]
    
    if current_pickedup_card.is_activated:
        raise Exception("Cannot pick activated card")

    if match.previous_pickedup_card_position is None:
        match.previous_pickedup_card_position = position
    else:
        """ already pick 2 card in round """

        p1 = match.previous_pickedup_card_position
        p2 = position

        if p1 == p2:
            raise Exception("Cannot pick same card in a round")

        card_1 = match.card_states[str(p1)]
        card_2 = current_pickedup_card

        """ matched card """
        if card_1.card_number == card_2.card_number:
            match.card_states[str(p1)].is_activated = True
            match.card_states[str(p2)].is_activated = True

        """ clear pick card session """
        match.previous_pickedup_card_position = None
        
    
    """ if all cards are activated, publish message to queue """
    if get_number_of_activated_cards(match.card_states) == 12:
        b = model.MatchResult(
                match_id=match_id,
                user_id=user_id,
                click_times=match.click_times,
                end_time=datetime.now()
        )
        mq.get_mq().publish(key="match_result", body=b.json())
        
        p.unwatch()
        c.delete(match_id)
    
    else:
        p.multi()
        p.set(match_id, match.to_json())
        p.execute()

    return current_pickedup_card.card_number
    
    


def get_current_match(user_id: str):
    return cache.get_cache().get("current_match__" + user_id)


def get_match_session_state(match_id: str, user_id: str):
    """ find match """
    j = cache.get_cache().get(match_id)
    match = model.Match.from_json(j)

    """ check permission """
    if match.user_id != user_id:
        raise Exception("Permission denied")

    activated_cards = []
    previous_pickedup_card = model.CardMappingPosition()

    """ find activated cards and previous picked up card """
    for position in match.card_states:
        card = match.card_states[position]
        if card.is_activated:
            activated_cards.append(model.CardMappingPosition(int(position), card.card_number))

        if int(position) == match.previous_pickedup_card_position:
            previous_pickedup_card.position = int(position)
            previous_pickedup_card.card_number = card.card_number

    session = model.MatchSessionState(
        match_id=match_id,
        click_times=match.click_times,
        previous_pickedup_card=(previous_pickedup_card if previous_pickedup_card.position is not None and previous_pickedup_card.card_number is not None else None),
        activated_cards=activated_cards
    )

    return session

def get_number_of_activated_cards(card_states: dict):
    count = []
    for pos in card_states:
        if card_states[pos].is_activated:
            count.append(1)
            
    return len(count)