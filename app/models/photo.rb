class Photo < ActiveRecord::Base
  # attr_accessible :place_id, :url

  belongs_to :place
end
