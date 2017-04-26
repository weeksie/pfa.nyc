defmodule PFA.PageController do
  use PFA.Web, :controller

  alias PFA.Repo
  alias PFA.Page
  
  def index(conn, _params) do
    render conn, "index.html"
  end

  def show(conn, %{ "url" => url }) do
    case Repo.get_by(Page, url: url) do
      nil  -> conn |> render("404.html")
      page -> conn |> render("show.html", content: page.content)
    end
  end
end
