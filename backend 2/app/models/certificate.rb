class Certificate < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :database_authenticatable, :jwt_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         jwt_revocation_strategy: self unless self == Certificate

  def roles
    []
  end
end