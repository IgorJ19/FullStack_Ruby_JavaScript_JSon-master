class ApplicationController < ActionController::API
  respond_to :json
  before_action :set_default_request_format, :authenticate_user!
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def record_not_found
    render json: {error: 'not found'}, status: :not_found
  end

  def set_default_request_format
    request.format = :json unless params[:format]
    headers['Access-Control-Allow-Headers'] = 'Authorization'
  end
end
