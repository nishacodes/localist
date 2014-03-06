class ListsController < ApplicationController
  before_filter :authenticate_user!, except: [:index]

  # GET /lists
  # GET /lists.json
  def index
    if user_signed_in?
      User.get_users(current_user)
      @joyride = current_user.joyride
      @recommendations = current_user.recommend
      @blacklist = current_user.blacklists.map {|b| b.place}
      @lists = List.where(user_id: current_user.id).reverse
      if @lists.length == 0
        List.create(name: "Casual bites", user_id: current_user.id)
        List.create(name: "Brunch favs", user_id: current_user.id)
        List.create(name: "Bar scene", user_id: current_user.id)
        @lists = List.where(user_id: current_user.id).reverse
      end
      @places = @lists.map {|list| list.places}
      gon.lists = List.where(user_id: current_user.id)
      gon.places_hash= {}
      gon.lists.each do |list|
        gon.places_hash[list.name] = list.places
      end
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @lists }
    end
  end

  # GET /lists/1
  # GET /lists/1.json
  def show
    @list = List.find(params[:id])
    @places = @list.places

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @list }
    end
  end

  # GET /lists/new
  # GET /lists/new.json
  def new
    @list = List.new
  end

  # GET /lists/1/edit
  def edit
    
    @list = List.find(params[:id])
    
    if current_user.id != @list.user_id
     flash[:notice] = "Sorry, you cannot edit this list."
     redirect_to(lists_path)
    end
  end

  # POST /lists
  # POST /lists.json
  def create
    @list = List.new(params[:list])

    if user_signed_in? 
      @list.user_id = current_user.id
    end

    respond_to do |format|
      if @list.save
        format.js
        format.html { redirect_to "/"} # , notice: 'List was successfully created.' 
        format.json { render json: @list, status: :created, location: @list }
      else
        format.html { render action: "new" }
        format.json { render json: @list.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /lists/1
  # PUT /lists/1.json
  def update
    @list = List.find(params[:id])

    respond_to do |format|
      if @list.update_attributes(params[:list])
        format.js {@list}
        format.html { redirect_to @list, notice: 'List was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @list.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lists/1
  # DELETE /lists/1.json
  def destroy
    @list_id = params[:id]
    @list = List.find(params[:id])
    @list.destroy
    @list.places.each {|place| place.destroy }
    respond_to do |format|
      # format.js
      format.html { redirect_to lists_url }
      format.json { head :no_content }
    end
  end

  def preferences
    # @recommendations = current_user.recommend
    @blacklist = current_user.blacklists.where("subtype = 'black'")
    @blacklist = @blacklist.map {|b|  Place.find_by_placeid(b.place) }
    @graylist = current_user.blacklists.where("subtype = 'gray'")
    @graylist = @graylist.map {|b|  Place.find_by_placeid(b.place) }
    
  end
end
