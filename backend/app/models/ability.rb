class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    if user.admin?
      # Admin ma pełne uprawnienia do wszystkich zasobów
      can :manage, :all
    else
      # Zwykli użytkownicy mogą odczytywać i edytować tylko swoje dane
      can :manage, User, id: user.id
      can :manage, Certificate, user_name: user.email
    end
  end
end

