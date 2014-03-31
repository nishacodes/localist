class AddDefaultmapToUsers < ActiveRecord::Migration
  def change
    add_column :users, :default_map, :integer
  end
end
