class Place < ActiveRecord::Base
  # attr_accessible :name

  has_many :list_places
  has_many :lists, :through => :list_places

end
