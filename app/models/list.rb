class List < ActiveRecord::Base
  # attr_accessible :name, :user_id

  # belongs_to :user
  belongs_to :map
  has_many :list_places
  has_many :places, :through => :list_places
end
