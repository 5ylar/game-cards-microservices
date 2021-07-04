package match_result

import (
	"time"

	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

type MatchResult struct {
	db *gorm.DB
	rc *redis.Client
}

func New(db *gorm.DB, rc *redis.Client) *MatchResult {
	return &MatchResult{
		db: db,
		rc: rc,
	}
}

func (s *MatchResult) ProcessMatchResult(m MatchResultData) error {

	err := s.db.Transaction(func(tx *gorm.DB) error {

		// save match result history
		if err := tx.Table("match_result_histories").Create(&m).Error; err != nil {
			return err
		}

		// update user summary
		if err := tx.Table("user_summaries").Where("user_id = ?", m.UserID).Update("min_click_times", gorm.Expr("min_click_times + ?", 1)).Error; err != nil {

			// if not found record, create new
			if err != gorm.ErrRecordNotFound {
				s := UserSummary{
					UserID:        m.UserID,
					MinClickTimes: m.ClickTimes,
				}

				if err := tx.Table("user_summaries").Create(&s).Error; err != nil {
					return err
				}
			}

			return err
		}

		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (s *MatchResult) GetSummary(userId string) (Summary, error) {
	// s.rc.Set("summary")
	return Summary{}, nil
}

func (c *MatchResult) Summary() error {
	return nil
}

type MatchResultData struct {
	MatchID    int       `gorm:"match_id" json:"matchId"`
	UserID     string    `gorm:"user_id" json:"userId"`
	ClickTimes int       `gorm:"click_times" json:"clickTimes"`
	StartTime  time.Time `gorm:"start_time" json:"startTime"`
	EndTime    time.Time `gorm:"end_time" json:"endTime"`
}

type UserSummary struct {
	UserID        string `gorm:"user_id" json:"userId"`
	MinClickTimes int    `gorm:"min_click_times" json:"minClickTimes"`
	// MaxClickTimes int    `gorm:"max_click_times" json:"maxClickTimes"`
	// AvgClickTimes int    `gorm:"avg_click_times" json:"avgClickTimes"`
	// PlayTimes     int    `gorm:"play_times" json:"playTimes"`
}

type Summary struct {
	MyMinClickTimes int `json:"myMinClickTimes"`
	MinClickTimes   int `json:"minClickTimes"`
	// UserTop10Ranks []UserSummary `json:"userTop10Ranks"`
}
