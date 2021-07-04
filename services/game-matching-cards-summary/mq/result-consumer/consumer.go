package result_consumer

import (
	"encoding/json"
	matchResult "game-matching-cards/internal/match-result"

	"github.com/streadway/amqp"
)

type resultConsumer struct {
	ch *amqp.Channel
	mr *matchResult.MatchResult
}

func New(ch *amqp.Channel, mr *matchResult.MatchResult) *resultConsumer {
	return &resultConsumer{
		ch,
		mr,
	}
}

func (c *resultConsumer) Listen(q amqp.Queue) error {
	msgs, err := c.ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)

	if err != nil {
		return nil
	}

	for msg := range msgs {

		var data matchResult.MatchResultData

		if err := json.Unmarshal(msg.Body, &data); err != nil {
			continue
		}

		if err := c.mr.ProcessMatchResult(data); err != nil {
			continue
		}

		msg.Ack(false)
	}

	return nil
}
