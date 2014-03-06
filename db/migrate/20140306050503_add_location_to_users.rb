class AddLocationToUsers < ActiveRecord::Migration
  def change
    add_column :users, :city, :string
    add_column :users, :state, :string
    add_column :users, :lat, :decimal
    add_column :users, :long, :decimal
  end
end
