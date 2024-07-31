class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    if user.admin?
      can :manage, :all
    else
      can :read, User, id: user.id
      if user.persisted?
        can :create, Resource
        can :update, Resource, user_id: user.id
        can :destroy, Resource, user_id: user.id
      end
    end
  end
end