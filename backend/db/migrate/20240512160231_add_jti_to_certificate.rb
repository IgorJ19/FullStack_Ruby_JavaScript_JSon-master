class AddJtiToCertificate < ActiveRecord::Migration[5.2]
  def change
    add_column :certificates, :jti, :string
    Certificate.all.each { |certificate| certificate.update_column(:jti, SecureRandom.uuid) }
    change_column_null :certificates, :jti, false
    add_index :certificates, :jti, unique: true
  end
end
