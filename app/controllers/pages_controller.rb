class PagesController < ApplicationController
  before_filter :authenticate_user!

  def discover
    @friends = current_user.get_friends
  end

end
