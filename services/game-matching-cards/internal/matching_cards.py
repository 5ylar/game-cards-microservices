import uuid, random, redis.client
from datetime import datetime
from typing import List

import rfc3339

from exception import exception
from . import cache
from . import mq
from . import matching_cards_model as model


def create_match(user_id: str) -> str:

    c = cache.get_cache()

    match = model.Match(user_id=user_id)

    """ gen cards list """
    match.cards = [ model.Card(number=(i % 6) + 1) for i in range(0, 12) ]

    """ shuffle cards """
    random.shuffle(match.cards)

    """ assign card positions """
    for i in range(0, 12): match.cards[i].position = i + 1

    """ generate match id """
    match_id = str(uuid.uuid4())

    """ remove previous match """
    try:
        previous_match_id = c.get("current_match__" + user_id)
        c.delete(previous_match_id)
    except:
        pass

    """ expire in 60 minutes """
    match_ttl = 60 * 60

    """ save match """
    c.set(match_id, match.json(), match_ttl)

    """ save current match id """
    c.set("current_match__" + user_id, match_id, match_ttl)

    return match_id


def pick_card(match_id: str, position: int, user_id: str) -> int:

    c = cache.get_cache()
    
    """ prevent race condition """
    p: redis.client.Pipeline = c.pipeline()
    p.watch(match_id, "current_match__" + user_id)

    match: model.Match = model.Match.parse_raw(p.get(match_id))

    if match is None:
        raise exception.err_not_found

    if match.user_id != user_id:
        raise exception.err_permission_denied

    if position < 1 or position > 12:
        raise exception.err_invalid_position_value

    """ add click times """
    match.click_times += 1

    """ current card """
    current_pickup_card = match.cards[position - 1]
    
    if current_pickup_card.is_activated:
        raise exception.err_cannot_pick_activated_card

    if match.previous_pickup_card is None:
        match.previous_pickup_card = current_pickup_card
    else:
        """ already pick 2 card in round """

        p1 = match.previous_pickup_card.position
        p2 = current_pickup_card.position

        if p1 == p2:
            raise exception.err_cannot_pick_same_card_in_round

        card_1 = match.previous_pickup_card
        card_2 = current_pickup_card

        """ matched card """
        if card_1.number == card_2.number:
            match.cards[p1 - 1].is_activated = True
            match.cards[p2 - 1].is_activated = True

        """ clear pick card session """
        match.previous_pickup_card = None

        """ if all cards are activated """
        if len([card for card in match.cards if card.is_activated]) == 12:

            """ publish match result to queue """
            b = model.MatchResult(
                    match_id=match_id,
                    user_id=user_id,
                    click_times=match.click_times,
                    end_time=rfc3339.rfc3339(datetime.now().timestamp())
            )
            mq.get_mq().publish(key="match_result", body=b.json())

            """ unwatch match data change """
            p.unwatch()

            """ delete current match of user """
            c.delete("current_match__" + user_id)

            """ delete match """
            c.delete(match_id)

            return current_pickup_card.number

    p.multi()
    """ update match """
    p.set(match_id, match.json())
    p.execute()

    return current_pickup_card.number
    
    
def get_current_match(user_id: str) -> str:
    return cache.get_cache().get("current_match__" + user_id)


def get_match_session_state(match_id: str, user_id: str) -> model.MatchSessionState:

    """ find match """
    match = model.Match.parse_raw(
        cache.get_cache().get(match_id)
    )

    """ check permission """
    if match.user_id != user_id:
        raise exception.err_permission_denied

    activated_cards = [card for card in match.cards if card.is_activated]

    session = model.MatchSessionState(
        match_id=match_id,
        click_times=match.click_times,
        previous_pickup_card=match.previous_pickup_card,
        activated_cards=activated_cards
    )

    return session
