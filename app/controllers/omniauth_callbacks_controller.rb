class OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def facebook
    user = User.from_omniauth(request.env["omniauth.auth"])
    if user.persisted?
      sign_in_and_redirect user
    else
      session["devise.user_attributes"] = user.attributes
      redirect_to facebook_url 
    end
  end

end