class ListPlace < ActiveRecord::Base
  # attr_accessible :list_id, :place_id

  belongs_to :list
  belongs_to :place

  validates_uniqueness_of :place_id, :scope => :list_id
end
