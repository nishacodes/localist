class ChangeTypeInBlacklists < ActiveRecord::Migration
  def change
    rename_column :blacklists, :type, :subtype
  end
end
