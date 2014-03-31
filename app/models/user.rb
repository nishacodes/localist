class User < ActiveRecord::Base
  cattr_accessor :recommendations, :joyride
  cattr_accessor :other_users
  attr_accessor :currentmap
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  after_create :get_coordinates, :create_map, :assign_default_map

  has_many :maps
  has_many :lists, :through => :maps
  has_many :places, :through => :lists
  has_many :blacklists
  

  # recommendations = "basis(current_user_place)" => {
  #   "other_user_list" => [other_user_places],
  #   "another_user_list" => [another_user_places]
  # }

  def recommend
    @recommendations = {}
    user_places = self.places.map do |place|
      place.placeid
    end
    @@other_users.each do |user|
      user.lists.each do |list|
        list.places.each do |place|
          if user_places.include?(place.placeid)
            # does not include the place the recommendation was based on 
            rec_places = list.places.tap { |array| array.delete_if{|p| user_places.include?(p.placeid)}} 
            @recommendations[place.name] = {list.name => rec_places }
          end
        end
      end
    end
    return @recommendations
  end

  def joyride
    self.places.count == 0
  end

  def self.get_users(current_user)
    all_users = User.all
    @@other_users = all_users.delete_if {|user| user.id == current_user.id}
  end

  def get_coordinates
    coordinates = Geocoder.coordinates("#{self.city}, #{self.state}") || [40.739453,-73.973613]
    self.lat = coordinates[0]
    self.long = coordinates[1]
    self.save
  end

  def create_map
    Map.create(city: self.city, state: self.state, lat: self.lat, long: self.long, user_id: self.id)
  end

  def assign_default_map
    self.default_map = self.maps.first.id
    self.save
    @currentmap = Map.find(self.default_map)
    debugger
    puts "hi"
    #  LEFT OFF HERE, CURRENTMAP IS NOT PERSISTING
  end
  
  def assign_lists_to_map
    map = Map.find(self.default_map)
    map.lists = self.lists
    map.save
  end

end
