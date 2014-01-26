class CreateListPlaces < ActiveRecord::Migration
  def change
    create_table :list_places do |t|
      t.integer :list_id
      t.integer :place_id

      t.timestamps
    end
  end
end
