class DropCertificatesTable < ActiveRecord::Migration[5.2]
  def up
    drop_table :certificates
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
