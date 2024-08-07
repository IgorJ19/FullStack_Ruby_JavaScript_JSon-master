class CreateCertificates1 < ActiveRecord::Migration[5.2]
  def change
    create_table :certificates do |t|
      t.string :name, null: false, default: ""
      t.string :description

      t.timestamps
    end

    add_index :certificates, :name, unique: true
  end
end
