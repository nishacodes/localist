class AddRatingurlToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :rating_url, :string
    add_column :places, :price_level, :integer
  end
end
