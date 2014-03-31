class Map < ActiveRecord::Base
  attr_accessible :city, :lat, :long, :state, :user_id

  belongs_to :user
  has_many :lists
end
