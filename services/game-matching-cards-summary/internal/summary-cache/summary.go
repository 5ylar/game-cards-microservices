package summary_caching

import "gorm.io/gorm"

type SummaryCache struct {
	db *gorm.DB
}

func New(db *gorm.DB) *SummaryCache {
	return &SummaryCache{
		db,
	}
}
