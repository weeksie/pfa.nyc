defmodule PFA.Repo.Migrations.CreateBlogPost do
  use Ecto.Migration

  def change do
    create table(:blog_posts) do
      add :title, :string
      add :url, :string

      timestamps()
    end

  end
end
