class CertificatesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_certificate, only: [:show, :update, :destroy]

  # GET /certificates
  # GET /certificates.json
  def index
    authorize! :read, Certificate, user_name: current_user.email
    if current_user.admin?
      @certificates = Certificate.paginate(page: params[:page], per_page: params[:per_page])
    else
      @certificates = Certificate.where(user_name: current_user.email).paginate(page: params[:page], per_page: params[:per_page])
    end
  end


  # POST /certificates
  # POST /certificates.json
  def create
    authorize! :create, Certificate, user_name: current_user.email
    @certificate = Certificate.new(certificate_params)

    if @certificate.save
      render :show, status: :created, location: @certificate
    else
      render json: @certificate.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /certificates/1
  # PATCH/PUT /certificates/1.json
  def update
    authorize! :update, Certificate, user_name: current_user.email

    if @certificate.update(certificate_params)
      render :show, status: :ok, location: @certificate
    else
      render json: @certificate.errors, status: :unprocessable_entity
    end
  end

  # DELETE /certificates/1
  # DELETE /certificates/1.json
    def destroy
      authorize! :destroy, Certificate, user_name: current_user.email
      @certificate.destroy
    end


  # Używane do ustawiania wspólnych zmiennych lub ograniczeń dla akcji.
  def set_certificate
    @certificate = Certificate.find(params[:id])
  end

  # Sprawdzanie uprawnień do odczytu dla wybranych akcji
  def authorize_read
    authorize! :read, Certificate, user_name: current_user.email
  end

  # Zaufaj tylko białej liście parametrów.
  def certificate_params
    params.require(:certificate).permit(:name, :description, :user_name)
  end
end
