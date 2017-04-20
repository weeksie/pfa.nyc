defmodule PFA.Repo.Migrations.CreateCard do
  use Ecto.Migration

  def change do
    create table(:cards) do
      add :name, :string
      add :url, :string
      add :description, :text

      timestamps()
    end

    create table(:card_projects) do
      add :card_id, :integer
      add :project_id, :integer
    end
    create index :card_projects, [ :card_id, :project_id ]

    create table(:card_blog_posts) do
      add :card_id, :integer
      add :blog_post_id, :integer
    end
    create index :card_blog_posts, [ :card_id, :blog_post_id ]

    create table(:card_testimonials) do
      add :card_id, :integer
      add :testimonial_id, :integer
    end
    create index :card_testimonials, [ :card_id, :testimonial_id ]
  end
end
