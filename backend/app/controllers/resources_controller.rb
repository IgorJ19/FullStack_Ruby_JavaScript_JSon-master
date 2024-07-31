class ResourcesController < ApplicationController
  load_and_authorize_resource

  def index
    @resources = Resource.all
  end

  def show
  end

  def new
    @resource = Resource.new
  end

  def create
    @resource = Resource.new(resource_params)
    if @resource.save
      redirect_to @resource, notice: 'Resource was successfully created.'
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @resource.update(resource_params)
      redirect_to @resource, notice: 'Resource was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @resource.destroy
    redirect_to resources_url, notice: 'Resource was successfully destroyed.'
  end

  private

  def resource_params
    params.require(:resource).permit(:attribute1, :attribute2)
  end
end
