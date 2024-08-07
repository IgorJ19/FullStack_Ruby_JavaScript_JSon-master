class UsersController < ApplicationController
  before_action :set_user, only: %i[show update destroy]
  before_action :authenticate_user!

  # GET /users
  # GET /users.json
  def index
    if current_user.admin?
      # Admin może zobaczyć wszystkich użytkowników
      authorize! :read, User
      @users = User.paginate(page: params[:page], per_page: params[:per_page])
    else
      # Zwykli użytkownicy mogą przeglądać tylko swoje dane
      authorize! :read, User, id: current_user.id
      @users = [current_user] # Tylko bieżący użytkownik
    end
  rescue CanCan::AccessDenied
    redirect_to root_path, alert: 'Nie masz uprawnień do przeglądania użytkowników.'
  end

  # Nowa akcja all_users
  def all_users
    authorize! :read, User
    @users = User.all
    render json: @users
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # POST /users
  # POST /users.json
  def create
    authorize! :create, User
    return unless current_user.admin?

    @user = User.new(user_params)

    if @user.save
      render :show, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    authorize! :update, User, id: current_user.id
    current_email = @user.email
    if @user.update(user_params)
      result = update_certificates_by_email(current_email, @user.email)
      if result[:message]
        render json: result, status: :ok
      else
        render json: result, status: :unprocessable_entity
      end
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    authorize! :destroy, @user

    if @user.admin?
      flash[:alert] = "Nie możesz usunąć konta administratora."
      redirect_to users_path
    else
      # Usunięcie certyfikatów powiązanych z użytkownikiem
      @user.certificates.destroy_all

      # Usunięcie użytkownika
      @user.destroy

      flash[:notice] = "Użytkownik został usunięty."
      redirect_to users_path
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def user_params
    params.require(:user).permit(:email, :password)
  end

  def update_certificates_by_email(user_email, new_user_name)
    certificates = Certificate.where(user_name: user_email)
    if certificates.update_all(user_name: new_user_name)
      { message: 'Certificates updated successfully' }
    else
      { error: 'Failed to update certificates' }
    end
  end
end

