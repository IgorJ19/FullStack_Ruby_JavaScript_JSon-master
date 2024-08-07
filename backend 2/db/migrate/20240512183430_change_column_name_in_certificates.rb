class ChangeColumnNameInCertificates < ActiveRecord::Migration[5.2]
  def change
    rename_column :certificates, :email, :name
  end
end
