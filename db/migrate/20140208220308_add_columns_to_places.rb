class AddColumnsToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :address, :string
    add_column :places, :lat, :decimal
    add_column :places, :long, :decimal
  end
end
