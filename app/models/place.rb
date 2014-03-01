class Place < ActiveRecord::Base
  # attr_accessible :name
  # validates :name, :presence => {:message => 'No place found. Please try again.'}
  has_many :list_places
  has_many :lists, :through => :list_places
  has_many :photos
end
