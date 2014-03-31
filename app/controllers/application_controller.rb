class ApplicationController < ActionController::Base
  protect_from_forgery

  def after_sign_up_path_for(current_user)
    debugger
    current_user.get_coordinates
  end

end
