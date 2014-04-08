class PagesController < ApplicationController
  before_filter :authenticate_user!

  def discover
    @friends = current_user.get_friends
    uids = @friends.collect {|f| f['id']} # collects all the ids of friends
    @registered_friends = User.where('uid IN (?)', uids) # collects all users that are friends
  end

end
