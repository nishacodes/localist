class Blacklist < ActiveRecord::Base
  attr_accessible :place, :subtype, :user_id

  belongs_to :user
end
