require "find"
class HomeController < ApplicationController
  def start
  end

  def index
    @image_names = image_names
    #@images = Dir.entries("#{Rails.public_path}/stereo_imgs/images")
    #@images = Find.find("#{Rails.public_path}/stereo_imgs/images/")
  end

  def show
    index = params[:i].to_i
    @file_name = image_names[index]
    @imgpath = "stereo_imgs/images/" + @file_name
    @mappath = "stereo_imgs/depth_maps/" + @file_name
    
    @prev = index > 0 ? index - 1 : nil
    @next = index < image_names.size - 1 ? index+1 : nil 
    
    #render "show", layout: false
  end

  def upload
  end

  def about
  end
  
  private
  def image_names
    Rails.cache.fetch("image_names_file_list", expires_in: 30.minutes) do
      return Dir.glob("#{Rails.public_path}/../app/assets/images/stereo_imgs/images/*").each{|str| str.gsub!("#{Rails.public_path}/../app/assets/images/stereo_imgs/images/","")}.sort
    end
  end
end
