class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]

  # GET /users
  # GET /users.json
  def index
    @users = User.paginate(page: params[:page], per_page: params[:per_page])
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      render :show, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  # metoda o dwóch parametrach wykonująca zawołanie SQL: UPDATE "certificates" SET "user_name" = 'ludek@op.pl' WHERE "certificates"."user_name" = ?  [["user_name", "przykład"]]
  def update_certificates_by_email(user_email, new_user_name)
    certificates = Certificate.where(user_name: user_email)
    if certificates.update_all(user_name: new_user_name)
      { message: 'Certificates updated successfully' }
    else
      { error: 'Failed to update certificates' }
    end
  end

  #zmieniony controller wykorzystujący powyższą metodę która ma nadane parametry: email(pobrany przed działaniem controllera) oraz email(który chcemy wprowadzić)
  def update
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
    @user.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params
    params.require(:user).permit(:email, :password)
  end
end
