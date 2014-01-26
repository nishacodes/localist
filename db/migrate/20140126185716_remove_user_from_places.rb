class RemoveUserFromPlaces < ActiveRecord::Migration
  def up
    remove_column :places, :user_id
  end

  def down
    add_column :places, :user_id, :integer
  end
end
