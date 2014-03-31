class AddMapToLists < ActiveRecord::Migration
  def change
    add_column :lists, :map_id, :integer
  end
end
