class AddPhoneToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :phone, :string
    add_column :places, :placeid, :string
  end
end
