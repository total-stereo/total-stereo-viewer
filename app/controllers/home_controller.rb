require "find"
class HomeController < ApplicationController
  def start
  end

  def index
    
    @mode = params[:mode] || "stereo"
    
    if @mode == "stereo"
      @image_names = stereo_image_names
    elsif @mode == "dia"
      @image_names = dia_image_names
    elsif @mode == "anaglyph"
      @image_names = anaglyph_image_names
    end

    #@images = Dir.entries("#{Rails.public_path}/stereo_imgs/images")
    #@images = Find.find("#{Rails.public_path}/stereo_imgs/images/")
  end

  def show
    index = params[:i].to_i
    @mode = params[:mode] || "stereo"
    
    if @mode == "stereo"
      @file_name = stereo_image_names[index]
      @imgpath = "stereo_imgs/images/" + @file_name
      @mappath = "stereo_imgs/depth_maps/" + @file_name
    elsif @mode == "dia"
      @file_name = dia_image_names[index]
      @imgpath = "dia_imgs/images/" + @file_name
    elsif @mode == "anaglyph"
      @file_name = anaglyph_image_names[index]
      @imgpath = "/images/" + @file_name
    end
    
    
    @prev = index > 0 ? index - 1 : nil
    @next = index < stereo_image_names.size - 1 ? index+1 : nil 
    @index = index
    
    #render "show", layout: false
  end

  def upload
  end

  def about
  end
  
  def about_collection
  end
  
  private
  def stereo_image_names
    Rails.cache.fetch("stereo_file_list", expires_in: 30.minutes) do
      return Dir.glob("#{Rails.public_path}/../app/assets/images/stereo_imgs/images/*").each{|str| str.gsub!("#{Rails.public_path}/../app/assets/images/stereo_imgs/images/","")}.sort
    end
  end
  def dia_image_names
    Rails.cache.fetch("dia_file_list", expires_in: 30.minutes) do
      return Dir.glob("#{Rails.public_path}/../app/assets/images/dia_imgs/images/*").each{|str| str.gsub!("#{Rails.public_path}/../app/assets/images/dia_imgs/images/","")}.sort
    end
  end
  def anaglyph_image_names
    Rails.cache.fetch("anaglyph_file_list", expires_in: 30.minutes) do
      return Dir.glob("#{Rails.public_path}/../app/assets/images//images/*").each{|str| str.gsub!("#{Rails.public_path}/../app/assets/images//images/","")}.sort
    end
  end
end
