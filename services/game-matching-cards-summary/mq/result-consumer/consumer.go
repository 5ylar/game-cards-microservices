package result_consumer

import (
	"encoding/json"
	matchResult "game-matching-cards-result/internal/match-result"
	"log"

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

func (c *resultConsumer) Listen() error {

	q, err := c.ch.QueueDeclare(
		"match_result", // name
		false,          // durable
		false,          // delete when unused
		false,          // exclusive
		false,          // no-wait
		nil,            // arguments
	)
	if err != nil {
		panic(err)
	}

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

	log.Println("######### Listening..... #########")

	f := make(chan struct{})

	go func() {
		for msg := range msgs {

			var data matchResult.MatchResultData

			if err := json.Unmarshal(msg.Body, &data); err != nil {
				log.Println("[ERROR] Unmarshal json err", err)
				msg.Reject(false)
				continue
			}

			log.Printf("> incoming data %+v\n", data)

			if err := c.mr.ProcessMatchResult(data); err != nil {
				log.Println("[ERROR] Process job err", err)
				msg.Reject(false)
				continue
			}

			msg.Ack(false)
		}
	}()

	<-f

	return nil
}
