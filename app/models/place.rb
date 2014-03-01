class Place < ActiveRecord::Base
  # attr_accessible :name
  validates :name, :presence => {:message => 'Name cannot be blank, Task not saved'}
  has_many :list_places
  has_many :lists, :through => :list_places
  has_many :photos
end
