class CertificatesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_certificate, only: [:show, :update, :destroy]

  # GET /certificates
  # GET /certificates.json
  def index
    authorize! :read, Certificate, user_name: current_user.email
    @certificates = if current_user.admin?
                      Certificate.paginate(page: params[:page], per_page: params[:per_page])
                    else
                      Certificate.where(user_name: current_user.email).paginate(page: params[:page], per_page: params[:per_page])
                    end
  end

  # GET /certificates/1
  # GET /certificates/1.json
  def show
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
    head :no_content
  end

  private

  def set_certificate
    @certificate = Certificate.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Certificate not found' }, status: :not_found
  end

  def certificate_params
    params.require(:certificate).permit(:name, :description, :user_name)
  end
end
