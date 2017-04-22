defmodule PFA.ProjectController do
  use PFA.Web, :controller

  alias PFA.Repo
  alias PFA.Project

  def index(conn, _params) do
    render conn, "index.html", projects: Repo.all(Project)
  end

  def show(conn, %{ "project_url" => url }) do
    case Repo.get_by(Project, url: url) do
      nil     -> conn |> render("404.html")
      project ->
        conn
        |> assign(:project, project)
        |> render("show.html")
    end
  end
end
