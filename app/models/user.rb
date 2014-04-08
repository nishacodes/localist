class User < ActiveRecord::Base
  cattr_accessor :recommendations, :joyride, :facebook
  cattr_accessor :other_users
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

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

  def joyride
    self.places.count == 0
  end

  def self.get_users(current_user)
    all_users = User.all
    @@other_users = all_users.delete_if {|user| user.id == current_user.id}
  end

  def self.from_omniauth(auth)
    where(auth.slice(:provider, :uid)).first_or_create.tap do |user|
      # debugger
      user.provider = auth.provider
      user.uid = auth.uid
      user.firstname = auth.info.first_name
      user.lastname = auth.info.last_name
      # user.email = auth.info.email
      if auth.info.location?
        user.city = auth.info.location.split(",").first
        user.state = auth.info.location.split(",").last.strip
      end
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
    end
  end

  def self.new_with_session(params, session)
    if session["devise.user_attributes"]
      new(session["devise.user_attributes"], without_protection: true) do |user|
        # debugger
        user.attributes = params
        user.valid?
      end
    else
      super
    end
  end

  def email_required?
    super && provider.blank?
  end

  def password_required?
    super && provider.blank?
  end

  def facebook
    @facebook ||= Koala::Facebook::API.new(oauth_token)
  end

  def get_friends
    facebook.get_connection("me", "friends")
  end
end
