class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.string :city
      t.string :state
      t.decimal :lat
      t.decimal :long
      t.integer :user_id

      t.timestamps
    end
  end
end
