package match_result

import (
	"time"

	"gorm.io/gorm"
)

type MatchResult struct {
	db *gorm.DB
}

func New(db *gorm.DB) *MatchResult {
	return &MatchResult{
		db: db,
	}
}

func (s *MatchResult) ProcessMatchResult(m MatchResultData) error {

	// save match result history
	if err := s.db.Table("match_result_histories").Create(&m).Error; err != nil {
		return err
	}

	return nil
}

func (s *MatchResult) getGlobalMinClickTimes() (int, error) {
	var queryResult struct {
		Min int `gorm:"column:min_click_times"`
	}

	if err := s.db.Table("match_result_histories").Select("MIN(click_times) AS min_click_times").Scan(&queryResult).Error; err != nil {
		return 0, err
	}

	return queryResult.Min, nil
}

func (s *MatchResult) getUserMinClickTimes(userID string) (int, error) {
	var queryResult struct {
		Min int `gorm:"column:min_click_times"`
	}

	if err := s.db.Table("match_result_histories").Select("MIN(click_times) AS min_click_times").Where("user_id = ?", userID).Scan(&queryResult).Error; err != nil {
		return 0, err
	}

	return queryResult.Min, nil
}

func (s *MatchResult) GetMinClickTimesSummary(userID string) (Summary, error) {

	userMin, err := s.getUserMinClickTimes(userID)
	if err != nil {
		return Summary{}, err
	}

	globalMin, err := s.getGlobalMinClickTimes()
	if err != nil {
		return Summary{}, err
	}

	summary := Summary{
		UserMinClickTimes:   userMin,
		GlobalMinClickTimes: globalMin,
	}

	return summary, nil
}

// Top 10 ranks
func (s *MatchResult) GetUserRanks() ([]UserRank, error) {
	var ranks []UserRank

	if err := s.db.Table("match_result_histories").Select("user_id , MIN(click_times) AS min_click_times").Group("user_id").Order("min_click_times ASC").Limit(10).Scan(&ranks).Error; err != nil {
		return []UserRank{}, err
	}

	return ranks, nil
}

type MatchResultData struct {
	MatchID    string    `gorm:"column:match_id" json:"match_id"`
	UserID     string    `gorm:"column:user_id" json:"user_id"`
	ClickTimes int       `gorm:"column:click_times" json:"click_times"`
	EndTime    time.Time `gorm:"column:end_time" json:"end_time"`
}

type UserRank struct {
	UserID        string `gorm:"column:user_id" json:"user_id"`
	MinClickTimes int    `gorm:"column:min_click_times" json:"min_click_times"`
}

type Summary struct {
	UserMinClickTimes   int `json:"user_min_click_times"`
	GlobalMinClickTimes int `json:"global_min_click_times"`
}
