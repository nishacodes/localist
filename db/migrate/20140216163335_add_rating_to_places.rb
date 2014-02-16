class AddRatingToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :rating, :decimal
  end
end
