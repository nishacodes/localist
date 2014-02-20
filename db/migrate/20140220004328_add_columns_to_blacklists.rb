class AddColumnsToBlacklists < ActiveRecord::Migration
  def change
    add_column :blacklists, :place, :string
    add_column :blacklists, :type, :string
    add_column :blacklists, :user_id, :integer
  end
end
