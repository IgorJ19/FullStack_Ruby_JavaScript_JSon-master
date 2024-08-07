class AddUserNameToCertificates < ActiveRecord::Migration[5.2]
    def change
      add_column :certificates, :user_name, :string
    end
  end
