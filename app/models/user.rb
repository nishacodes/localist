class User < ActiveRecord::Base
  cattr_accessor :recommendations
  cattr_accessor :other_users
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  # attr_accessible :title, :body

  has_many :lists
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
  
  def self.get_users(current_user)
    all_users = User.all
    @@other_users = all_users.delete_if {|user| user.id == current_user.id}
  end
end
